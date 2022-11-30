import PageHeader from '@/components/PageHeader'
import RelayRegionPicker from '@/components/RelayRegionPicker'
import SettingsStore from '@/store/SettingsStore'
import { createRef, Fragment } from 'react'
import { useSnapshot } from 'valtio'
import { cosmosWallets } from '@/utils/CosmosWalletUtil'
import { createOrRestoreEIP155Wallet, eip155Wallets } from '@/utils/EIP155WalletUtil'
import { solanaWallets } from '@/utils/SolanaWalletUtil'
import { elrondWallets } from '@/utils/ElrondWalletUtil'
import { Card, Divider, Row, Switch, Text, Textarea, Button } from '@nextui-org/react'
import packageJSON from '../../package.json'

export default function SettingsPage() {
  const { account, testNets, eip155Address, cosmosAddress, solanaAddress, elrondAddress } = useSnapshot(
    SettingsStore.state
  )

  const eip155Mnemonic = eip155Wallets[eip155Address].getMnemonic();
  const eip155Ref = createRef<HTMLTextAreaElement>()
  const walletNumber = account+1;

  const onUpdate = () => {
    const mnemonic = eip155Ref.current?.value?.trim()
    if (mnemonic) {
      localStorage.setItem(`EIP155_MNEMONIC_${walletNumber}`, mnemonic)
      const { eip155Addresses } = createOrRestoreEIP155Wallet()
      SettingsStore.setEIP155Address(eip155Addresses[0])
    }
  }

  return (
    <Fragment>
      <PageHeader title="Settings" />

      <Text h4 css={{ marginBottom: '$5' }}>
        Packages
      </Text>
      <Row justify="space-between" align="center">
        <Text color="$gray400">@walletconnect/sign-client</Text>
        <Text color="$gray400">{packageJSON.dependencies['@walletconnect/sign-client']}</Text>
      </Row>
      <Row justify="space-between" align="center">
        <Text color="$gray400">@walletconnect/utils</Text>
        <Text color="$gray400">{packageJSON.dependencies['@walletconnect/utils']}</Text>
      </Row>
      <Row justify="space-between" align="center">
        <Text color="$gray400">@walletconnect/types</Text>
        <Text color="$gray400">{packageJSON.devDependencies['@walletconnect/types']}</Text>
      </Row>

      <Divider y={2} />

      <Text h4 css={{ marginBottom: '$5' }}>
        Testnets
      </Text>
      <Row justify="space-between" align="center">
        <Switch checked={testNets} onChange={SettingsStore.toggleTestNets} />
        <Text>{testNets ? 'Enabled' : 'Disabled'}</Text>
      </Row>

      <Divider y={2} />

      <Row justify="space-between" align="center">
        <Text h4 css={{ marginBottom: '$5' }}>
          Relayer Region
        </Text>
        <RelayRegionPicker />
      </Row>

      <Divider y={2} />

      <Text css={{ color: '$yellow500', marginBottom: '$5', textAlign: 'left', padding: 0 }}>
        Warning: mnemonics and secret keys are provided for development purposes only and should not
        be used elsewhere!
      </Text>
      <Text css={{ marginBottom: '$5' }}>
        <Button onClick={onUpdate}>Update</Button>
      </Text>

      <Text h4 css={{ marginTop: '$5', marginBottom: '$5' }}>
        EIP155 Mnemonic
      </Text>
      <Card bordered borderWeight="light" css={{ minHeight: '100px' }}>
        <Textarea ref={eip155Ref} css={{ fontFamily: '$mono', margin: 0 }} initialValue={eip155Mnemonic} />
      </Card>

      <Text h4 css={{ marginTop: '$10', marginBottom: '$5' }}>
        Cosmos Mnemonic
      </Text>
      <Card bordered borderWeight="light" css={{ minHeight: '100px' }}>
        <Text css={{ fontFamily: '$mono' }}>{cosmosWallets[cosmosAddress].getMnemonic()}</Text>
      </Card>

      <Text h4 css={{ marginTop: '$10', marginBottom: '$5' }}>
        Solana Secret Key
      </Text>
      <Card bordered borderWeight="light" css={{ minHeight: '215px', wordWrap: 'break-word' }}>
        <Text css={{ fontFamily: '$mono' }}>{solanaWallets[solanaAddress].getSecretKey()}</Text>
      </Card>

      <Text h4 css={{ marginTop: '$10', marginBottom: '$5' }}>
        Elrond Mnemonic
      </Text>
      <Card bordered borderWeight="light" css={{ minHeight: '215px', wordWrap: 'break-word' }}>
        <Text css={{ fontFamily: '$mono' }}>{elrondWallets[elrondAddress].getMnemonic()}</Text>
      </Card>
    </Fragment>
  )
}
